

interface RoleCreationAttrs {
  value: string;
  description: string;
}

export class Role {
  // @ApiProperty({ example: "1", description: "Unique ID" })
  // @Column({
  //   type: DataType.INTEGER,
  //   unique: true,
  //   autoIncrement: true,
  //   primaryKey: true,
  // })
  // id: number;
  //
  // @ApiProperty({ example: "ADMIN", description: " Unique user's role value" })
  // @Column({ type: DataType.STRING, unique: true, allowNull: false })
  // value: string;
  //
  // @ApiProperty({ example: "Administrator", description: "Role description" })
  // @Column({ type: DataType.STRING, allowNull: false })
  // description: string;
  //
  // @BelongsToMany(() => User, () => UserRoles)
  // users: User[];
}