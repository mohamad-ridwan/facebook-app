import React from 'react'
import { Helmet } from 'react-helmet'

const TitleHelmet = ({title, link}) => {
  return (
    <Helmet>
        <meta charSet='utf-8'/>
        <title>{title}</title>
        <link rel="canonical" href={link} />
    </Helmet>
  )
}

export default TitleHelmet