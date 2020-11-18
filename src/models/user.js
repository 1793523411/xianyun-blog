import { request } from 'ice';

export default {
  state: {
    name: '111',
    lottery: '111',
    avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
    // userid: null,
  },
  effects: (dispatch) => ({
    async fetchUserProfile() {
      const res = await request.get('/user/info');
      // alert('111');
      // console.log(res);
      if (res.code === 200) {
        // console.log(res.data)
        dispatch.user.update({ name: res.data.userNickName, lottery: res.data.lottery, avatar: res.data.avatar });
      }
    },
  }),
  reducers: {
    update(prevState, payload) {
      return { ...prevState, ...payload };
    },
  },
};
