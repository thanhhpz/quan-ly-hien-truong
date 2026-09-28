import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService{
    constructor (
        private readonly prisma: PrismaService
    ){}
    async findAll(){
        return this.prisma.nguoi_dung.findMany({
            select:{
                ma_nguoi_dung: true,
                ten_dang_nhap: true,
                ho_ten: true,
                so_dien_thoai: true,
                email: true,
                trang_thai: true,
            }
        })
    }
}