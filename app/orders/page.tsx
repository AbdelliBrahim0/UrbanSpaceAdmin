"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const initialOrders = [
  {
    id: 1,
    utilisateurId: 1,
    utilisateurNom: "Ahmed Ben Ali",
    produits: [
      { nom: "T-shirt Oversize", quantite: 2, prix: 45.0 },
      { nom: "Jean Slim", quantite: 1, prix: 65.0 },
    ],
    total: 155.0,
    dateCommande: "2024-03-15",
    statut: "en préparation",
    adresseLivraison: "123 Rue de la Liberté, Tunis",
    moyenPaiement: "Carte bancaire",
  },
  {
    id: 2,
    utilisateurId: 2,
    utilisateurNom: "Fatma Trabelsi",
    produits: [{ nom: "Robe d'été", quantite: 1, prix: 75.0 }],
    total: 75.0,
    dateCommande: "2024-03-14",
    statut: "expédiée",
    adresseLivraison: "456 Avenue Habib Bourguiba, Sfax",
    moyenPaiement: "PayPal",
  },
  {
    id: 3,
    utilisateurId: 3,
    utilisateurNom: "Mohamed Gharbi",
    produits: [{ nom: "Sneakers", quantite: 1, prix: 120.0 }],
    total: 120.0,
    dateCommande: "2024-03-13",
    statut: "livrée",
    adresseLivraison: "789 Rue des Oliviers, Sousse",
    moyenPaiement: "Cash à la livraison",
  },
]

const statusColors = {
  "en préparation": "default",
  expédiée: "secondary",
  livrée: "default",
  annulée: "destructive",
} as const

const statusIcons = {
  "en préparation": Package,
  expédiée: Truck,
  livrée: CheckCircle,
  annulée: XCircle,
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredOrders = orders.filter(
    (order) =>
      order.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm),
  )

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, statut: newStatus } : order)))
    toast({
      title: "Statut mis à jour",
      description: `La commande #${orderId} a été mise à jour.`,
    })
  }

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Gestion des Commandes</h1>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Commandes</CardTitle>
                <CardDescription>Suivez et gérez toutes les commandes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par client ou numéro de commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.statut as keyof typeof statusIcons]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.utilisateurNom}</TableCell>
                      <TableCell>{order.dateCommande}</TableCell>
                      <TableCell>{order.total.toFixed(2)} TND</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <Select value={order.statut} onValueChange={(value) => handleStatusChange(order.id, value)}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en préparation">En préparation</SelectItem>
                              <SelectItem value="expédiée">Expédiée</SelectItem>
                              <SelectItem value="livrée">Livrée</SelectItem>
                              <SelectItem value="annulée">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => viewOrderDetails(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails de la commande #{selectedOrder?.id}</DialogTitle>
              <DialogDescription>Informations complètes de la commande</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Client</h4>
                    <p>{selectedOrder.utilisateurNom}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Date de commande</h4>
                    <p>{selectedOrder.dateCommande}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Statut</h4>
                    <Badge variant={statusColors[selectedOrder.statut as keyof typeof statusColors]}>
                      {selectedOrder.statut}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold">Moyen de paiement</h4>
                    <p>{selectedOrder.moyenPaiement}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Adresse de livraison</h4>
                  <p>{selectedOrder.adresseLivraison}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Produits commandés</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.produits.map((produit: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{produit.nom}</TableCell>
                          <TableCell>{produit.quantite}</TableCell>
                          <TableCell>{produit.prix.toFixed(2)} TND</TableCell>
                          <TableCell>{(produit.quantite * produit.prix).toFixed(2)} TND</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold text-lg">Total de la commande</span>
                  <span className="font-bold text-lg">{selectedOrder.total.toFixed(2)} TND</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
