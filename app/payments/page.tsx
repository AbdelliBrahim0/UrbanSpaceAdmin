"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, CreditCard, Smartphone, Banknote } from "lucide-react"

const initialPayments = [
  {
    id: 1,
    commandeId: 1,
    montant: 155.0,
    moyen: "Carte bancaire",
    statut: "payé",
    datePaiement: "2024-03-15",
  },
  {
    id: 2,
    commandeId: 2,
    montant: 75.0,
    moyen: "PayPal",
    statut: "payé",
    datePaiement: "2024-03-14",
  },
  {
    id: 3,
    commandeId: 3,
    montant: 120.0,
    moyen: "Cash à la livraison",
    statut: "payé",
    datePaiement: "2024-03-13",
  },
  {
    id: 4,
    commandeId: 4,
    montant: 89.5,
    moyen: "Carte bancaire",
    statut: "échoué",
    datePaiement: "2024-03-12",
  },
]

const paymentIcons = {
  "Carte bancaire": CreditCard,
  PayPal: Smartphone,
  "Cash à la livraison": Banknote,
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPayments = payments.filter(
    (payment) =>
      payment.commandeId.toString().includes(searchTerm) ||
      payment.moyen.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "payé":
        return "default"
      case "échoué":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const totalPaid = payments.filter((p) => p.statut === "payé").reduce((sum, p) => sum + p.montant, 0)

  const totalFailed = payments.filter((p) => p.statut === "échoué").reduce((sum, p) => sum + p.montant, 0)

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Gestion des Paiements</h1>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payé</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPaid.toFixed(2)} TND</div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.statut === "payé").length} paiements réussis
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements Échoués</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFailed.toFixed(2)} TND</div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.statut === "échoué").length} paiements échoués
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((payments.filter((p) => p.statut === "payé").length / payments.length) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Sur {payments.length} transactions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historique des Paiements</CardTitle>
                <CardDescription>Consultez tous les paiements effectués</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par commande ou moyen de paiement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Commande</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Moyen de paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const PaymentIcon = paymentIcons[payment.moyen as keyof typeof paymentIcons] || CreditCard
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">#{payment.commandeId}</TableCell>
                      <TableCell className="font-semibold">{payment.montant.toFixed(2)} TND</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <PaymentIcon className="h-4 w-4" />
                          <span>{payment.moyen}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.statut)}>{payment.statut}</Badge>
                      </TableCell>
                      <TableCell>{payment.datePaiement}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
