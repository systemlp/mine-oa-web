export const defaultPagination = {
  defaultPageSize: 5,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
  showTotal: (total, range) => {
    return `共${total}条 / 当前${range.join('至')}条`;
  }
};
