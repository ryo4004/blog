const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { source: { eq: "blog" }}}
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                source
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.source + '' + post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        source: post.node.fields.source,
        previous,
        next,
      },
    })
  })

  const planets = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { source: { eq: "planets" }}}
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                source
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (planets.errors) {
    throw planets.errors
  }

  // Create blog posts pages.
  const planetPosts = planets.data.allMarkdownRemark.edges

  planetPosts.forEach((post, index) => {
    const previous = index === planetPosts.length - 1 ? null : planetPosts[index + 1].node
    const next = index === 0 ? null : planetPosts[index - 1].node

    createPage({
      path: post.node.fields.source + '' + post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        source: post.node.fields.source,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    const parent = getNode(node.parent)
    console.log({value, parent})
    // console.log(JSON.stringify(parent, undefined, 2))
    createNodeField({
      node,
      name: `slug`,
      value
    })
    createNodeField({
      node,
      name: 'source',
      value: parent.sourceInstanceName,
    })
  }
}
