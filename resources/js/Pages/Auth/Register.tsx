import { User, Lock } from "lucide-react";
import React, { FormEvent, ReactNode } from "react";
import Input from "@/Components/ui/Input";
import Button from "@/Components/ui/Button/Button";
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import {Link} from "@inertiajs/react";

const Register = () => {
    const {data, setData, post, processing, reset, errors} = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegis = (e: FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
            <main className="p-5 flex flex-col justify-center items-center h-[100vh]">
            <Head title="Register" />
            <div className="shadow-[0px_0px_4px_rgba(0,0,0,0.2)] p-5 rounded-2xl flex flex-col gap-2 w-full md:w-[30%]">
                <h1 className="text-center text-3xl font-bold">Register</h1>
                <form onSubmit={handleRegis} className="flex flex-col gap-[10px] p-2">
                    <Input 
                        id="name" 
                        name="name" 
                        label="Name" 
                        required 
                        placeholder="Masukkan Nama"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                        error={errors.name}
                        icon={<User size={18} />}
                        value={data.name}
                    />
                    <Input 
                        id="email" 
                        name="email" 
                        label="Email" 
                        placeholder="Masukkan Email"
                        required
                        icon={<User size={18} />}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                        error={errors.email}
                        value={data.email}
                    />
                    <Input 
                        id="password" 
                        name="password" 
                        label="Password" 
                        type="password" 
                        required 
                        icon={<Lock size={18} />}
                        placeholder="Masukkan Password" 
                        value={data.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                    <Input 
                        id="password_confirmation"
                        name="password_confirmation"
                        label="Konfirmasi Password"
                        placeholder="Konfirmasi Password"
                        type="password"
                        required
                        icon={<Lock size={18} />}
                        value={data.password_confirmation}
                        error={errors.password_confirmation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                    />
                    <Button type="submit" disabled={processing} className="mt-2">
                        {processing ? 'Memproses...' : 'Register'}
                    </Button>
                </form>
                <div className="flex justify-center italic hover:underline">
                    <Link href={route('login')}>Sudah Daftar?</Link>
                </div>
            </div>
        </main>

   
        
    )
}

export default Register;