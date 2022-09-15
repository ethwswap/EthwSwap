export default defineComponent({
  name: 'WButton',
  props: {
    size: {
      type: String,
      default: ''
    },
  },
  setup(props, { emit, attrs, slots }) {
    let btnClass = 'box-border bg-primary-500 border-0 outline-none text-white '
    let btnHoverClass = 'hover:bg-primary-400 active:bg-primary-600'
    if (!props.size || props.size === 'default') {
      btnClass += 'px-5 h-10 leading-10 rounded-full cursor-pointer'
    }
    return () => {
      // dark="text-white" light="text-black"
      return (
        <button class={[btnClass, btnHoverClass]}>
          {slots?.default()}
        </button>
      )
    }
  }
})
