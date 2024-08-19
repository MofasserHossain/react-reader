export interface AddHighlight {
  color: string
  type: 'highlight' | 'comment' | 'define'
  note: string
}

export interface HighlightComment {
  text: string
  color: string
}
