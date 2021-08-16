import {
  defineComponent,
  h,
  ref,
  Ref,
  unref,
  computed,
  toRefs,
  VNode,
  resolveComponent,
  onUnmounted
} from 'vue';
import IconDown from 'virtual:vite-icons/mdi/arrow-down';
import IconUp from 'virtual:vite-icons/mdi/arrow-up';

import CTableColumn from './c-table-column';
import { isDef } from '@/utils';

export function useIsMobile(mobileWidth: Ref<number> | number) {
  const width = ref(window.innerWidth);
  const isMobile = ref(width.value <= unref(mobileWidth));
  const handler = () => {
    width.value = window.innerWidth;
    isMobile.value = width.value <= unref(mobileWidth);
  };
  const clean = () => window.removeEventListener('resize', handler);
  window.addEventListener('resize', handler, { passive: true });
  return { width, isMobile, clean };
}

export default defineComponent({
  name: 'CTable',
  components: {
    IconDown,
    IconUp
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    mobile: {
      type: Number,
      default: 768
    },
    defaultSort: {
      type: String
    },
    defaultSortOrder: {
      type: String,
      default: 'asc'
    }
  },
  setup(props, { slots }) {
    const { data, defaultSort, defaultSortOrder, mobile } = toRefs(props);

    const { isMobile, clean } = useIsMobile(mobile);
    onUnmounted(() => clean());

    const sortField = ref(defaultSort.value);
    const sortOrder = ref<'asc' | 'desc'>(
      defaultSortOrder.value as 'asc' | 'desc'
    );

    const setSortField = (label: string) => {
      sortField.value = label;
      sortOrder.value = defaultSort.value as 'asc' | 'desc';
    };
    const filpSortOrder = () => {
      if (sortOrder.value === 'desc') sortOrder.value = 'asc';
      else sortOrder.value = 'desc';
    };

    const filterColumn = (slots?: VNode[]) =>
      slots ? slots.filter((slot) => slot.type === CTableColumn) : [];

    const columns = filterColumn(slots.columns ? slots.columns({}) : []);

    const sortedData = computed(() => {
      const sorted = (data: any[]) => {
        if (isDef(sortField.value)) {
          for (const slot of columns) {
            const label = slot.props?.label ?? '';
            if (label === sortField.value) {
              const arr = data.sort(slot.props?.sort);
              return sortOrder.value === 'desc' ? arr.reverse() : arr;
            }
          }
          return data;
        } else {
          return data;
        }
      };
      return sorted(data.value);
    });

    const renderDestop = () => {
      const renderHead = () =>
        columns.map((column) => {
          const hasSort = isDef(column.props?.sort);
          const isActiveSort =
            hasSort && (column.props?.label ?? '') === sortField.value;

          const style = {
            width: column.props?.width,
            borderWidth: '0 0 2px 0'
          };

          const align =
            column.props?.align === 'center' ||
            (isDef(column.props?.center) && column.props?.center !== false)
              ? 'justify-center'
              : column.props?.align === 'right'
              ? 'justify-end'
              : 'justify-start';

          const className = [
            'select-none',
            'font-600',
            'px-3',
            'py-2',
            'border-solid',
            !isActiveSort ? 'border-[#dbdbdb]' : 'border-[#7a7a7a]',
            hasSort ? 'cursor-pointer' : null,
            hasSort ? 'hover:border-[#7a7a7a]' : null
          ];

          return h(
            'th',
            { style, class: className },
            h(
              'div',
              {
                class: ['flex', 'items-center', align],
                onClick: hasSort
                  ? () => {
                      if (isActiveSort) {
                        filpSortOrder();
                      } else {
                        setSortField(column.props?.label ?? '');
                      }
                    }
                  : undefined
              },
              [
                hasSort
                  ? h(
                      sortOrder.value === 'desc'
                        ? resolveComponent('icon-down')
                        : resolveComponent('icon-up'),
                      {
                        class: [!isActiveSort && 'text-transparent']
                      }
                    )
                  : '',
                h('span', {}, column.props?.label)
              ]
            )
          );
        });

      const renderBody = (data: any[]) =>
        data.map((row, index) => {
          return h(
            'tr',
            {},
            slots.columns && filterColumn(slots.columns({ row, index }))
          );
        });

      return h(
        'table',
        {
          class: ['table', 'w-full', 'border-separate', 'table-auto', 'rounded']
        },
        [
          h('thead', {}, h('tr', {}, renderHead())),
          h('tbody', {}, renderBody(sortedData.value)),
          h('tfoot', {}, [])
        ]
      );
    };

    const renderMobile = () => {
      const renderBody = () => {
        return sortedData.value.map((row, index) => {
          const columns = filterColumn(
            slots.columns && slots.columns({ row, index, mobile: true })
          );
          return h(
            'div',
            { class: ['box', 'p-0', 'mb-4'] },
            columns.map((column) => {
              const customHeader =
                (column.props && column.props['mobile-header-class']) ?? [];
              return h(
                'div',
                {
                  class: [
                    'pl-3',
                    'border',
                    'flex',
                    'flex-shrink',
                    'justify-between',
                    'justify-items-stretch'
                  ]
                },
                [
                  h(
                    'div',
                    {
                      class: ['py-2', 'font-600', 'text-left', ...customHeader]
                    },
                    column.props?.label
                  ),
                  h(column, { class: ['block'] })
                ]
              );
            })
          );
        });
      };

      return h('div', { class: ['mobile-table'] }, renderBody());
    };

    return () => (!isMobile.value ? renderDestop() : renderMobile());
  }
});
