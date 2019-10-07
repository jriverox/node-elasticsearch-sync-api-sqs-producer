import * as swagger from 'swagger2'
import { ui } from 'swagger2-koa'

const document = swagger.loadDocumentSync('./swagger.yaml')

export default ui(document, '/docs')
