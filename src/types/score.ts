export interface CollectionScore {
  vocabulary: number | null
  quiz: number | null
  writing: number | null
  stars: {
    vocabulary: boolean
    quiz: boolean
    writing: boolean
  }
  totalStars: number
}
