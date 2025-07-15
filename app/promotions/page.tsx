"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Percent } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialPromotions = [
  {
    id: 1,
    codePromo: "BLACKFRIDAY25",
    type: "%",
    valeur: 25,
    produitId: null,
    categorieId: 1,
    categorieName: "Homme",
    dateDebut: "2024-11-25",
    dateFin: "2024-11-30",
    nombreUtilisationsMax: 100,
    utilisationsActuelles: 45,
  },
  {
    id: 2,
    codePromo: "WELCOME10",
    type: "montant",
    valeur: 10,
    produitId: null,
    categorieId: null,
    categorieName: "Toutes catégories",
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    nombreUtilisationsMax: 500,
    utilisationsActuelles: 234,
  },
  {
    id: 3,
    codePromo: "SUMMER20",
    type: "%",
    valeur: 20,
    produitId: 2,
    produitName: "Robe d'été",
    categorieId: null,
    dateDebut: "2024-06-01",
    dateFin: "2024-08-31",
    nombreUtilisationsMax: 50,
    utilisationsActuelles: 12,
  },
]

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    codePromo: "",
    type: "%",
    valeur: "",
    dateDebut: "",
    dateFin: "",
    nombreUtilisationsMax: "",
  })

  const filteredPromotions = promotions.filter((promotion) =>
    promotion.codePromo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const promotionData = {
      ...formData,
      valeur: Number.parseFloat(formData.valeur),
      nombreUtilisationsMax: Number.parseInt(formData.nombreUtilisationsMax),
    }

    if (editingPromotion) {
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === editingPromotion.id ? { ...promotion, ...promotionData } : promotion,
        ),
      )
      toast({
        title: "Promotion modifiée",
        description: "La promotion a été modifiée avec succès.",
      })
    } else {
      const newPromotion = {
        id: Math.max(...promotions.map((p) => p.id)) + 1,
        ...promotionData,
        produitId: null,
        categorieId: null,
        categorieName: "Toutes catégories",
        utilisationsActuelles: 0,
      }
      setPromotions([...promotions, newPromotion])
      toast({
        title: "Promotion créée",
        description: "La promotion a été créée avec succès.",
      })
    }

    setIsDialogOpen(false)
    setEditingPromotion(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      codePromo: "",
      type: "%",
      valeur: "",
      dateDebut: "",
      dateFin: "",
      nombreUtilisationsMax: "",
    })
  }

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion)
    setFormData({
      codePromo: promotion.codePromo,
      type: promotion.type,
      valeur: promotion.valeur.toString(),
      dateDebut: promotion.dateDebut,
      dateFin: promotion.dateFin,
      nombreUtilisationsMax: promotion.nombreUtilisationsMax.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setPromotions(promotions.filter((promotion) => promotion.id !== id))
    toast({
      title: "Promotion supprimée",
      description: "La promotion a été supprimée avec succès.",
      variant: "destructive",
    })
  }

  const isPromotionActive = (dateDebut: string, dateFin: string) => {
    const now = new Date()
    const debut = new Date(dateDebut)
    const fin = new Date(dateFin)
    return now >= debut && now <= fin
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Gestion des Promotions</h1>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Promotions</CardTitle>
                <CardDescription>Créez et gérez vos codes promotionnels</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingPromotion(null)
                      resetForm()
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingPromotion ? "Modifier la promotion" : "Ajouter une promotion"}</DialogTitle>
                    <DialogDescription>
                      {editingPromotion
                        ? "Modifiez les informations de la promotion."
                        : "Créez une nouvelle promotion."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="codePromo" className="text-right">
                          Code promo
                        </Label>
                        <Input
                          id="codePromo"
                          value={formData.codePromo}
                          onChange={(e) => setFormData({ ...formData, codePromo: e.target.value.toUpperCase() })}
                          className="col-span-3"
                          placeholder="BLACKFRIDAY25"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="%">Pourcentage (%)</SelectItem>
                            <SelectItem value="montant">Montant fixe (TND)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="valeur" className="text-right">
                          Valeur
                        </Label>
                        <Input
                          id="valeur"
                          type="number"
                          value={formData.valeur}
                          onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                          className="col-span-3"
                          placeholder={formData.type === "%" ? "25" : "10"}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dateDebut" className="text-right">
                          Date début
                        </Label>
                        <Input
                          id="dateDebut"
                          type="date"
                          value={formData.dateDebut}
                          onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dateFin" className="text-right">
                          Date fin
                        </Label>
                        <Input
                          id="dateFin"
                          type="date"
                          value={formData.dateFin}
                          onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombreUtilisationsMax" className="text-right">
                          Utilisations max
                        </Label>
                        <Input
                          id="nombreUtilisationsMax"
                          type="number"
                          value={formData.nombreUtilisationsMax}
                          onChange={(e) => setFormData({ ...formData, nombreUtilisationsMax: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">{editingPromotion ? "Modifier" : "Créer"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un code promo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code promo</TableHead>
                  <TableHead>Réduction</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Utilisations</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium font-mono">{promotion.codePromo}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Percent className="h-4 w-4" />
                        <span>{promotion.type === "%" ? `${promotion.valeur}%` : `${promotion.valeur} TND`}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{promotion.dateDebut}</div>
                        <div className="text-muted-foreground">au {promotion.dateFin}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {promotion.utilisationsActuelles}/{promotion.nombreUtilisationsMax}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(promotion.utilisationsActuelles / promotion.nombreUtilisationsMax) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isPromotionActive(promotion.dateDebut, promotion.dateFin) ? "default" : "secondary"}
                      >
                        {isPromotionActive(promotion.dateDebut, promotion.dateFin) ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(promotion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(promotion.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
