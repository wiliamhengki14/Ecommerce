import Modal from "@/Components/Modal";
import Button from "@/Components/ui/Button/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

interface OrderPaymentModalProps {
    show: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirm: () => void;
}

export default function OrderPaymentModal({ show, onClose, totalAmount, onConfirm }: OrderPaymentModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6 flex flex-col">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4">
                    Konfirmasi Order
                </h2>
                <Tabs defaultValue="cash" className="w-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-gray-100 rounded-lg">
                        <TabsTrigger 
                            value="cash" 
                            className="border-2 border-transparent data-active:border-[#1c1c1c] data-active:shadow-sm"
                        >
                            Cash
                        </TabsTrigger>
                        <TabsTrigger 
                            value="qris" 
                            className="border-2 border-transparent data-active:border-[#1c1c1c] data-active:shadow-sm"
                        >
                            QRIS
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="cash">
                        <p className="text-sm text-gray-600 text-center">
                            Apakah Anda yakin ingin menyelesaikan order ini secara tunai (cash)?<br/>
                            Total pembayaran: <span className="font-bold text-gray-900">Rp {Number(totalAmount).toLocaleString('id-ID')}</span>
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button color="sekunder" onClick={onClose}>
                                Batal
                            </Button>
                            <Button color="primer" onClick={onConfirm}>
                                Ya, Order
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="qris">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <p className="text-sm text-gray-600 text-center">
                                Scan QR Code berikut untuk membayar senilai:<br/>
                                <span className="text-xl font-bold text-gray-900">Rp {Number(totalAmount).toLocaleString('id-ID')}</span>
                            </p>
                            <div className="bg-white p-3 rounded-xl border-2 border-gray-200 shadow-sm inline-block">
                                <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                                    <rect width="5" height="5" x="3" y="3" rx="1"/>
                                    <rect width="5" height="5" x="16" y="3" rx="1"/>
                                    <rect width="5" height="5" x="3" y="16" rx="1"/>
                                    <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                                    <path d="M21 21v.01"/>
                                    <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                                    <path d="M3 12h.01"/>
                                    <path d="M12 3h.01"/>
                                    <path d="M12 16v.01"/>
                                    <path d="M16 12h1"/>
                                    <path d="M21 12v.01"/>
                                    <path d="M12 21v-1"/>
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500 text-center">Buka aplikasi e-Wallet atau M-Banking Anda untuk melakukan pembayaran.</p>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button color="sekunder" onClick={onClose}>
                                Batal
                            </Button>
                            <Button color="primer" onClick={onConfirm}>
                                Sudah Bayar & Order
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Modal>
    );
}
