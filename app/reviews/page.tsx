"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Star, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialReviews = [
  {
    id: 1,
    produitId: 1,
    produitNom: "T-shirt Oversize",
    utilisateurId: 1,
    utilisateurNom: "Ahmed Ben Ali",
    note: 5,
    commentaire: "Excellent produit, très confortable et de bonne qualité !",
    date: "2024-03-15",
  },
  {
    id: 2,
    produitId: 2,
    produitNom: "Robe d'été",
    utilisateurId: 2,
    utilisateurNom: "Fatma Trabelsi",
    note: 4,
    commentaire: "Belle robe, mais la taille est un peu grande.",
    date: "2024-03-14",
  },
  {
    id: 3,
    produitId: 1,
    produitNom: "T-shirt Oversize",
    utilisateurId: 3,
    utilisateurNom: "Mohamed Gharbi",
    note: 3,
    commentaire: "Correct mais j'attendais mieux pour le prix.",
    date: "2024-03-13",
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredReviews = reviews.filter(
    (review) =>
      review.produitNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    setReviews(reviews.filter((review) => review.id !== id))
    toast({
      title: "Avis supprimé",
      description: "L'avis a été supprimé avec succès.",
      variant: "destructive",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const getNoteBadgeVariant = (note: number) => {
    if (note >= 4) return "default"
    if (note >= 3) return "secondary"
    return "destructive"
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Gestion des Avis</h1>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Avis clients</CardTitle>
                <CardDescription>Consultez et modérez les avis laissés par vos clients</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par produit ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.produitNom}</TableCell>
                    <TableCell>{review.utilisateurNom}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.note)}
                        <Badge variant={getNoteBadgeVariant(review.note)}>{review.note}/5</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">{review.commentaire}</p>
                    </TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
