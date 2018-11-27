export default {
  input: {
    border: '1px solid #eee',
    padding: '12px 15px',
    height: '51px',
    width: '100%',
    fontSize: '16px',

    '&:focus': {
      outline: 'none',
    },

    '&:focus + $list': {
      display: 'block',
    },
  },

  inputWrapper: {
    position: 'relative',
    width: '320px',
    textAlign: 'left',
  },

  list: {
    display: 'none',
    position: 'absolute',
    top: '51px',
    right: 0,
    left: 0,
    maxHeight: '180px',
    overflow: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },

  item: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1,
    background: '#fff',
    borderBottom: '1px solid #eee',
    height: '60px',
    padding: '5px 15px',
    transition: 'background .2s',
    color: '#282c34',
    fontWeight: 500,
    textDecoration: 'none',
    position: 'relative',
    cursor: 'pointer',

    '&:hover': {
      background: '#aeaeae',
      color: '#fff',
    },
  },

  itemActive: {
    composes: '$item',
    background: '#aeaeae',
    color: '#fff',
  }
};
