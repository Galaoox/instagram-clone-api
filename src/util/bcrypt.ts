import bcrypt from 'bcrypt';

export async function encrypt(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}


export async function comparePassword(password: string, passwordBd: string = ''): Promise<Boolean> {

    return password && passwordBd ? await bcrypt.compare(password, passwordBd) : false;

}