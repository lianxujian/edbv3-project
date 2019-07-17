/**
 * Created by chenyin on 2019-06-11.
 */
const getters={
  dynamicTags(state) {
    return state.tags.dynamicTags;
  },
  currentIndex(state) {
    return state.tags.currentIndex;
  }
};

export default getters
