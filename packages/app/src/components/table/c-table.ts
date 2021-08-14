import { defineComponent, h, toRefs } from 'vue';
// import CTableColumn from './c-table-column'

export default defineComponent({
  name: 'CTable',
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  setup(props, { slots }) {
    const { data } = toRefs(props);

    return () => {
      const columns = slots.columns ? slots.columns({}) : [];

      const renderHead = () =>
        columns.map((column) => {
          const style = {
            width: column.props?.width,
            borderWidth: '0 0 2px 0'
          };
          const className = [
            'font-600',
            'px-3',
            'py-2',
            'border-solid',
            'border-[#dbdbdb]',
            column.props?.align === 'center'
              ? 'text-center'
              : column.props?.align === 'right'
              ? 'text-right'
              : 'text-left'
          ];
          return h(
            'th',
            { style, class: className },
            h('div', {}, column.props?.label)
          );
        });

      const renderBody = (data: any[]) =>
        data.map((row, index) => {
          return h('tr', {}, slots.columns && slots.columns({ row, index }));
        });

      return h(
        'table',
        {
          class: ['table', 'w-full', 'border-separate', 'table-auto', 'rounded']
        },
        [
          h('thead', {}, h('tr', {}, renderHead())),
          h('tbody', {}, renderBody(data.value)),
          h('tfoot', {}, [])
        ]
      );
    };
  }
});
