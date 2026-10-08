import Modal from "@/Components/Modal";
import Button from "@/Components/ui/Button/Button";

interface ClearCartModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ClearCartModal({ show, onClose, onConfirm }: ClearCartModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-extrabold text-red-600">
                    Batalkan Keranjang
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Apakah Anda yakin ingin mengosongkan semua isi keranjang? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button color="sekunder" onClick={onClose}>
                        Kembali
                    </Button>
                    <Button className="bg-red-600 text-white hover:bg-red-700" onClick={onConfirm}>
                        Ya, Kosongkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
