import Modal from "@/Components/Modal";
import { useState } from "react";
import Button from "@/Components/ui/Button/Button";
interface LogoutModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
}
const LogOut = (props: LogoutModalProps) => {
    const { show, onClose, onConfirm } = props;
    return (
        <Modal show={show} onClose={onClose} maxWidth='sm'>
            <div className='p-6 flex flex-col'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-extrabold text-red-800 text-2xl mb-2'>Konfirmasi Logout</h2>
                </div>
                <p className='text-[#1c1c1c]'>Apakah anda ingin logout?</p>
                <div className='flex justify-end gap-2 mt-4'>
                    <Button color='sekunder' onClick={onClose}>Batal</Button>
                    <Button className='bg-red-500 text-white' onClick={onConfirm}>Ya, Logout</Button>
                </div>
            </div>
        </Modal>
    )
}

export default LogOut;