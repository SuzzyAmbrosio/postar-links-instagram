"use client"

import { useEffect, useState } from "react"
import { Plus, Instagram } from "lucide-react"
import Link from "next/link"

export default function InstagramPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      const res = await fetch('/api/instagram')
      const data = await res.json()
      setAccounts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Contas Instagram</h1>
            <button className="flex items-center gap-2 rounded bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={18} />
            Conectar Conta
            </button>
        </div>

        {loading? (
            <div className="text-center py-8">Carregando...</div>
        ) : accounts.length === 0? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <Instagram size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold">Nenhuma conta conectada</h3>
            <p className="text-sm text-gray-600 mb-4">Conecte sua conta do Instagram para começar a postar automaticamente</p>
            <button className="rounded bg-[#1976D2] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Conectar Instagram
            </button>
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((acc) => (
                    <Link
                        key={acc.id}
                        href={`/dashboard/config?accountId=${acc.id}`}
                        className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <img src={acc.profilePicture} alt="" className="h-12 w-12 rounded-full" />
                            <div>
                                <p className="font-semibold">@{acc.username}</p>
                                <p className="text-xs text-gray-500">{acc.followersCount} seguidores</p>
                            </div>
                        </div>
                        <div className={`text-xs font-semibold ${acc.isActive? 'text-green-600' : 'text-gray-400'}`}>
                            {acc.isActive? 'Ativo' : 'Inativo'}
                        </div>
                    </Link>
            ))}
        </div>
      ) }
    </div>
  )
}