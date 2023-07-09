import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './services/group.service';
import {
  NotFoundException,
  NotImplementedException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserAuthService } from '@modules/user-auth/user-auth.service';
import { MessageService } from './services/message.service';
import { UserEntity } from '@database/entities/user.entity';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly groupService: GroupService,
    private readonly userAuthService: UserAuthService,
    private readonly messageService: MessageService,
  ) {}
  async handleConnection(socket: Socket) {
    const jwtToken = socket.handshake.headers.authorization as string;
    const decodedJwtToken = await this.userAuthService.verifyJwt(jwtToken);
    const user = await this.userAuthService.findOne({
      where: { id: decodedJwtToken.user.id },
    });

    try {
      if (!user) {
        return this.disconnect(socket);
      }

      socket.data.user = user;

      user.socketId = socket.id;
      await user.save();

      const userRooms = await this.groupService.getUserGroups(user.id);

      return this.server.to(socket.id).emit('user_rooms', userRooms);
    } catch {
      this.disconnect(socket);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
  async handleDisconnect(socket: Socket) {
    const user = await this.userAuthService.findOne({
      where: { socketId: socket.id },
    });
    if (user) {
      user.socketId = null;
      await user.save();
    }
  }

  async onModuleInit() {
    this.userAuthService.update({}, { socketId: null });
  }

  @SubscribeMessage('send_message')
  async onCreateMessage(socket: Socket, createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    const { group_id, sender_id } = createMessageDto;

    const group = await this.groupService.findOne({
      where: { id: group_id },
    });

    if (!group)
      throw new NotFoundException(`Group with id=${group_id} not found`);

    const groupMembers = group.memebers;

    const isTheUserMemberOfTheGroup =
      !!groupMembers.find((gm: UserEntity) => gm.id === sender_id) ||
      group.owner_id === sender_id;

    if (!isTheUserMemberOfTheGroup)
      throw new UnauthorizedException(
        `User with id=${sender_id} not authorized to perform this action`,
      );

    const groupMembersSocketsId = groupMembers
      .map((gm) => gm.socketId)
      .filter((id) => !!id) as string[];

    await message.save();

    groupMembersSocketsId.forEach((socketId) =>
      this.server.to(socketId).emit('receive_message', createMessageDto),
    );
  }

  @SubscribeMessage('create_group')
  async onCreateGroup(socket: Socket, createGroupDto: CreateGroupDto) {
    await this.groupService.createGroup(createGroupDto);
    const userGroups = await this.groupService.getUserGroups(
      createGroupDto.owner_id,
    );
    this.server.to(socket.id).emit('user_rooms', userGroups);
  }

  @SubscribeMessage('join_group')
  async onJoinGroup(socket: Socket) {
    throw new NotImplementedException();
  }

  @SubscribeMessage('leave_group')
  async onLeaveGroup(socket: Socket) {
    throw new NotImplementedException();
  }
}
