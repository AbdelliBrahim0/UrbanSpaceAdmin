"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialCategories = [
  {
    id: 1,
    nom: "Homme",
    description: "Vêtements et accessoires pour hommes",
  },
  {
    id: 2,
    nom: "Femme",
    description: "Vêtements et accessoires pour femmes",
  },
  {
    id: 3,
    nom: "Enfants",
    description: "Vêtements pour enfants de tous âges",
  },
  {
    id: 4,
    nom: "Accessoires",
    description: "Sacs, bijoux et autres accessoires",
  },
  {
    id: 5,
    nom: "Chaussures",
    description: "Chaussures pour toute la famille",
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
  })

  const filteredCategories = categories.filter((category) =>
    category.nom.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      setCategories(
        categories.map((category) => (category.id === editingCategory.id ? { ...category, ...formData } : category)),
      )
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès.",
      })
    } else {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        ...formData,
      }
      setCategories([...categories, newCategory])
      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès.",
      })
    }

    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData({ nom: "", description: "" })
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      nom: category.nom,
      description: category.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))
    toast({
      title: "Catégorie supprimée",
      description: "La catégorie a été supprimée avec succès.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Gestion des Catégories</h1>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Catégories</CardTitle>
                <CardDescription>Organisez vos produits par catégories</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingCategory(null)
                      setFormData({ nom: "", description: "" })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une catégorie
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
                    <DialogDescription>
                      {editingCategory ? "Modifiez les informations de la catégorie." : "Créez une nouvelle catégorie."}
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
                    </div>
                    <DialogFooter>
                      <Button type="submit">{editingCategory ? "Modifier" : "Créer"}</Button>
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
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.nom}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
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
