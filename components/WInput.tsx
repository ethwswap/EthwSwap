export default defineComponent({
  name: 'WInput',
  emits: ['update:modelValue', 'change', 'input'],
  props: {
    modelValue: {
      type: String || Number,
      default: '' || 0
    },
    size: {
      type: String,
      default: ''
    },
  },
  setup(props, { emit, attrs }) {
    let btnClass = 'box-border text-black border outline-none '
    let btnHoverClass = 'hover:border-primary-500 focus:border-primary-500 '
    if (!props.size || props.size === 'default') {
      btnClass += 'px-4 h-10 leading-10 rounded'
    }
    const onInput = (event: Event) => {
      let input = (event.target as HTMLInputElement).value
      if (props.modelValue !== input) {
        emit('update:modelValue', input)
        emit('input', input)
        emit('change', input)
      }
    }
    return () => {
      return (
        <input type="text"
          class={[btnClass, btnHoverClass]}
          value={props.modelValue}
          onInput={onInput}
          onChange={onInput}
          placeholder={attrs.placeholder as string}
        />
      );
    }
  }
})
