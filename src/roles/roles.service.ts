import { Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";


@Injectable()
export class RolesService {
    constructor() {}

    // async createRole(dto: CreateRoleDto){
    //     const role = await this.roleRepository.create(dto);
    //     return role;
    // }
    //
    // async getRoleByValue(value: string){
    //     const role = await this.roleRepository.findOne({where:{value}})
    //     return role
    // }
}
