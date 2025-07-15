
"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function ManageUsersPage() {
    const { userData } = useAuth();
    const router = useRouter();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (userData && userData.role !== 'admin') {
            // REVISI: Menggunakan toast untuk notifikasi error
            toast.error("Akses Ditolak", { description: "Hanya admin yang bisa mengakses halaman ini." });
            router.push('/');
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);
            } catch (error) {
                console.error("Gagal mengambil data pengguna:", error);
                toast.error("Gagal", { description: "Gagal mengambil data pengguna. Pastikan Security Rules sudah benar." });
            }
            setLoading(false);
        };

        if (userData?.role === 'admin') {
            fetchUsers();
        }
    }, [userData, router]);

    const handleRoleChange = async (userId, newRole) => {
        if (!confirm(`Anda yakin ingin mengubah role user ini menjadi '${newRole}'?`)) return;
        const userDocRef = doc(db, "users", userId);
        try {
            await updateDoc(userDocRef, { role: newRole });
            setUsers(currentUsers => currentUsers.map(user => user.id === userId ? { ...user, role: newRole } : user));
            // REVISI: Mengganti alert dengan notifikasi toast sukses
            toast.success("Sukses!", { description: `Role untuk user berhasil diubah menjadi '${newRole}'.` });
        } catch (error) {
            console.error("Gagal mengubah role:", error);
            // REVISI: Mengganti alert dengan notifikasi toast error
            toast.error("Gagal", { description: "Terjadi kesalahan saat mengubah role." });
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserName || !newUserEmail) {
            // REVISI: Mengganti alert dengan notifikasi toast warning
            toast.warning("Input Tidak Lengkap", { description: "Nama dan Email wajib diisi." });
            return;
        }
        setIsSubmitting(true);
        
        const q = query(collection(db, "users"), where("email", "==", newUserEmail));
        const emailCheckSnapshot = await getDocs(q);
        if (!emailCheckSnapshot.empty) {
            // REVISI: Mengganti alert dengan notifikasi toast error
            toast.error("Gagal Menambah", { description: "Email sudah terdaftar di sistem." });
            setIsSubmitting(false);
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "users"), {
                name: newUserName,
                email: newUserEmail,
                role: newUserRole,
                uid: null,
                createdAt: new Date()
            });
            // REVISI: Mengganti alert dengan notifikasi toast sukses
            toast.success("Pengguna Ditambahkan!", { description: `Pengguna ${newUserName} berhasil didaftarkan.` });
            setUsers(prevUsers => [...prevUsers, { id: docRef.id, name: newUserName, email: newUserEmail, role: newUserRole, uid: null }]);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserRole('user');
        } catch (error) {
            console.error("Gagal menambah pengguna: ", error);
            // REVISI: Mengganti alert dengan notifikasi toast error
            toast.error("Gagal", { description: "Gagal menambah pengguna baru ke database." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <div className="p-8 text-center">Memuat data pengguna...</div>;
    if (!userData || userData.role !== 'admin') return <div className="p-8 text-center">Memeriksa izin...</div>;

    return (
        // ... Seluruh bagian JSX (tampilan form dan tabel) tidak perlu diubah ...
        // ... Anda bisa menggunakan kode JSX dari pesan saya sebelumnya ...
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Tambah Pengguna Baru (Pra-registrasi)</h2>
                <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1"><label htmlFor="new-name" className="block text-sm font-medium text-gray-700">Nama</label><input type="text" id="new-name" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/></div>
                    <div className="md:col-span-1"><label htmlFor="new-email" className="block text-sm font-medium text-gray-700">Email</label><input type="email" id="new-email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/></div>
                    <div className="md:col-span-1"><label htmlFor="new-role" className="block text-sm font-medium text-gray-700">Role</label><select id="new-role" value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="user">user (teknisi)</option><option value="admin">admin</option></select></div>
                    <div className="md:col-span-1"><button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">{isSubmitting ? 'Menyimpan...' : 'Tambah'}</button></div>
                </form>
            </div>
            <h1 className="text-3xl font-bold mb-6">Daftar Pengguna Terdaftar</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {user.uid === userData.uid ? (<span className="font-semibold">{user.role} (Anda)</span>) : (<select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="p-1 border rounded-md shadow-sm"><option value="user">user</option><option value="admin">admin</option></select>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-8">
                <Link href="/"><button className="text-blue-600 hover:text-blue-800 hover:underline">&larr; Kembali ke Halaman Utama</button></Link>
            </div>
        </div>
    );
}