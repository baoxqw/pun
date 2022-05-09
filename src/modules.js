export default function loadView(view) {
  let fixView = view.substring(view.indexOf('/') + 1)
  switch (view.substring(0, view.indexOf('/'))) {
    case '@eladmin':
      console.log('--loadViewloadView------',view.substring(view.indexOf('/') + 1))
      return (resolve) => require([`@eladmin/views/${fixView}`], resolve)
    case '@system':
      return (resolve) => require([`@system/views/system/${fixView}`], resolve)
    case '@datasource':
      return (resolve) => require([`@datasource/views/datasources/${fixView}`], resolve)
    case '@indicator':
      return (resolve) => require([`./views/indicators/${fixView}`], resolve)
    case '@workflow':
      return (resolve) => require([`@workflow/views/activiti/${fixView}`], resolve)
    default:
      return (resolve) => require([`@/views/${view}`], resolve)
  }
}
