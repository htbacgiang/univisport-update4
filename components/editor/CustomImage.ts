import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export const CustomImage = Image.extend({
  inline() {
    return false
  },

  group() {
    return 'block'
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: element => element.getAttribute('data-caption') || null,
        renderHTML: attributes => {
          if (!attributes.caption) {
            return {}
          }
          return {
            'data-caption': attributes.caption,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (element) => {
          const img = (element as HTMLElement).querySelector('img');
          const figcaption = (element as HTMLElement).querySelector('figcaption');
          if (!img) return false;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: figcaption ? figcaption.textContent : null,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          const img = element as HTMLElement;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: img.getAttribute('data-caption') || null,
          };
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;

    if (caption) {
      return [
        'figure',
        { class: 'image-caption-wrapper' },
        ['img', mergeAttributes(this.options.HTMLAttributes, imgAttrs)],
        ['figcaption', {}, caption],
      ]
    }

    return ['img', mergeAttributes(this.options.HTMLAttributes, imgAttrs)]
  },
})
