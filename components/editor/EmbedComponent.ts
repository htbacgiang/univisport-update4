import { Node, mergeAttributes } from '@tiptap/core'

export interface EmbedComponentOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embedComponent: {
      /**
       * Chèn một React component có sẵn vào nội dung bài viết
       */
      setEmbedComponent: (options: { name: string; props?: string }) => ReturnType
    }
  }
}

export const EmbedComponent = Node.create<EmbedComponentOptions>({
  name: 'embedComponent',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-component'),
        renderHTML: (attributes) => ({ 'data-component': attributes.name }),
      },
      props: {
        default: '{}',
        parseHTML: (element) => element.getAttribute('data-props') || '{}',
        renderHTML: (attributes) => ({ 'data-props': attributes.props || '{}' }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-component]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const label = node.attrs.name || 'Component'
    // Lưu ý: data-component và data-props được TipTap inject tự động từ addAttributes
    // Nhưng ta explicit set thêm để đảm bảo luôn có trong HTML output
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-component': node.attrs.name,
        'data-props': node.attrs.props || '{}',
        class: 'embed-component-block',
        style:
          'display:flex; align-items:center; justify-content:center; gap:8px; border:2px dashed #105d97; border-radius:8px; padding:16px 24px; margin:20px 0; background:#f0f7ff; color:#105d97; font-weight:600; font-size:14px; cursor:default; user-select:none;',
      }),
      ['span', { style: 'font-size:20px;' }, '🧩'],
      ['span', {}, `Component: ${label}`],
    ]
  },

  addCommands() {
    return {
      setEmbedComponent:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              name: options.name,
              props: options.props || '{}',
            },
          })
        },
    }
  },
})
