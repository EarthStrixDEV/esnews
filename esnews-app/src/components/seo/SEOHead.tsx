interface Props {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}

function SEOHead({ title, description, image, type = 'website' }: Props) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
    </>
  )
}

export default SEOHead
