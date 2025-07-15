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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const initialProducts = [
  {
    id: 1,
    nom: "T-shirt Oversize",
    description: "T-shirt confortable en coton bio",
    prix: 45.0,
    tailleDisponible: ["S", "M", "L", "XL"],
    couleurDisponible: ["Noir", "Blanc", "Gris"],
    quantiteStock: 50,
    images: ["/placeholder.svg?height=100&width=100"],
    categorie: "Homme",
    dateAjout: "2024-01-15",
  },
  {
    id: 2,
    nom: "Robe d'été",
    description: "Robe légère parfaite pour l'été",
    prix: 75.0,
    tailleDisponible: ["XS", "S", "M", "L"],
    couleurDisponible: ["Rouge", "Bleu", "Jaune"],
    quantiteStock: 30,
    images: ["/placeholder.svg?height=100&width=100"],
    categorie: "Femme",
    dateAjout: "2024-02-10",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    tailleDisponible: "",
    couleurDisponible: "",
    quantiteStock: "",
    categorie: "",
    images: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categorie.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...formData,
      prix: Number.parseFloat(formData.prix),
      quantiteStock: Number.parseInt(formData.quantiteStock),
      tailleDisponible: formData.tailleDisponible.split(",").map((t) => t.trim()),
      couleurDisponible: formData.couleurDisponible.split(",").map((c) => c.trim()),
      images: formData.images ? [formData.images] : ["/placeholder.svg?height=100&width=100"],
    }

    if (editingProduct) {
      setProducts(
        products.map((product) => (product.id === editingProduct.id ? { ...product, ...productData } : product)),
      )
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès.",
      })
    } else {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...productData,
        dateAjout: new Date().toISOString().split("T")[0],
      }
      setProducts([...products, newProduct])
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      })
    }

    setIsDialogOpen(false)
    setEditingProduct(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      prix: "",
      tailleDisponible: "",
      couleurDisponible: "",
      quantiteStock: "",
      categorie: "",
      images: "",
    })
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      nom: product.nom,
      description: product.description,
      prix: product.prix.toString(),
      tailleDisponible: product.tailleDisponible.join(", "),
      couleurDisponible: product.couleurDisponible.join(", "),
      quantiteStock: product.quantiteStock.toString(),
      categorie: product.categorie,
      images: product.images[0] || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Gestion des Produits</h1>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produits</CardTitle>
                <CardDescription>Gérez votre catalogue de produits</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingProduct(null)
                      resetForm()
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
                    <DialogDescription>
                      {editingProduct ? "Modifiez les informations du produit." : "Créez un nouveau produit."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nom" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prix" className="text-right">
                          Prix (TND)
                        </Label>
                        <Input
                          id="prix"
                          type="number"
                          step="0.01"
                          value={formData.prix}
                          onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categorie" className="text-right">
                          Catégorie
                        </Label>
                        <Select
                          value={formData.categorie}
                          onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Homme">Homme</SelectItem>
                            <SelectItem value="Femme">Femme</SelectItem>
                            <SelectItem value="Enfants">Enfants</SelectItem>
                            <SelectItem value="Accessoires">Accessoires</SelectItem>
                            <SelectItem value="Chaussures">Chaussures</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tailleDisponible" className="text-right">
                          Tailles
                        </Label>
                        <Input
                          id="tailleDisponible"
                          value={formData.tailleDisponible}
                          onChange={(e) => setFormData({ ...formData, tailleDisponible: e.target.value })}
                          className="col-span-3"
                          placeholder="S, M, L, XL"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="couleurDisponible" className="text-right">
                          Couleurs
                        </Label>
                        <Input
                          id="couleurDisponible"
                          value={formData.couleurDisponible}
                          onChange={(e) => setFormData({ ...formData, couleurDisponible: e.target.value })}
                          className="col-span-3"
                          placeholder="Rouge, Bleu, Vert"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantiteStock" className="text-right">
                          Stock
                        </Label>
                        <Input
                          id="quantiteStock"
                          type="number"
                          value={formData.quantiteStock}
                          onChange={(e) => setFormData({ ...formData, quantiteStock: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="images" className="text-right">
                          Image URL
                        </Label>
                        <Input
                          id="images"
                          value={formData.images}
                          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                          className="col-span-3"
                          placeholder="URL de l'image"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">{editingProduct ? "Modifier" : "Créer"}</Button>
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
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.nom}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.nom}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.categorie}</Badge>
                    </TableCell>
                    <TableCell>{product.prix.toFixed(2)} TND</TableCell>
                    <TableCell>
                      <Badge variant={product.quantiteStock > 10 ? "default" : "destructive"}>
                        {product.quantiteStock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
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
