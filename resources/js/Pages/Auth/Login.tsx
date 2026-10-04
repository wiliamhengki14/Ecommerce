import React, { FormEvent } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import Input from "@/Components/ui/Input";
import {Link} from "@inertiajs/react";
import { PageProps } from "@/types";
import { User, Lock } from "lucide-react";
import Checkbox from "@/Components/Checkbox";

interface LoginProps {
    status?: string;
}

const Login = ({ status }: LoginProps) => {

    const {flash} = usePage<PageProps<{ flash: {message?: string}}>>().props;
    // 1. Inisialisasi state form bawaan Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // 2. Handler submit form menuju route auth Laravel
    const handleLogin = (event: FormEvent) => {
        event.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <main className="p-[20px] flex flex-col items-center justify-center min-h-[100vh] bg-slate-50">
            <Head title="Login" />

            <div className="shadow-[0px_0px_4px_rgba(0,0,0,0.2)] p-[32px] rounded-[20px] md:w-[30%] w-full bg-white">
                <h1 className="text-center font-bold text-3xl text-[#1c1c1c] mb-1">Warung Wiliam Jaya</h1>
                <h1 className="text-center text-[16px] mb-5 text-[#1c1c1c]">Silahkan login untuk melanjutkan</h1>

                {/* Notifikasi status session (misal setelah reset password) */}
                {status && (
                    <div className="mb-4 text-sm text-emerald-600 text-center font-medium">
                        {status}
                    </div>
                )}

                {flash?.message && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                        {flash.message}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <Input
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        required
                        placeholder="Masukkan Email"
                        value={data.email}
                        error={errors.email}
                        icon={<User size={18} />}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("email", e.target.value)}
                    />

                    <Input
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        required
                        placeholder="Masukkan Password"
                        value={data.password}
                        error={errors.password}
                        icon={<Lock size={18} />}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("password", e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">Ingat saya</span>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        color="primer"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing ? "Memproses..." : "Login"}
                    </Button>
                </form>
                <Link href={route('register')} className="mt-[15px] text-center flex justify-center hover:underline italic">Belum Punya Akun?</Link>
            </div>
            
        </main>
    );
};

export default Login;