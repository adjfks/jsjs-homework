const acorn = require('acorn');
const astring = require('astring');
const traverse = require('../../common/traverse');

function transform(root, originName, targetName) {
  // 遍历所有节点
  return traverse((node, ctx, next) => {

    // TODO: 作业代码写在这里
    if (node.type === 'VariableDeclarator' || node.type === 'FunctionDeclaration' && node.id) {
      node.id.name = node.id.name === originName ? targetName : node.id.name
    }

    if (node.type === 'MemberExpression' && node.object) {
      node.object.name = node.object.name === originName ? targetName : node.object.name
    }

    if (node.type === 'BinaryExpression') {
      if(node.left) node.left.name = node.left.name === originName ? targetName : node.left.name
      if(node.right) node.right.name = node.right.name === originName ? targetName : node.right.name
    }

    // 继续往下遍历
    return next(node, ctx)
  })(root);
}

function rename(code, originName, targetName) {
  const ast = acorn.parse(code, {
    ecmaVersion: 5,
  })
  return astring.generate(transform(ast, originName, targetName))
}

module.exports = rename
