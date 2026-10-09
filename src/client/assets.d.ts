declare module '*.css?inline' {
  const stylesheet: string
  export default stylesheet
}

declare module '*.png?inline' {
  const dataUri: string
  export default dataUri
}
