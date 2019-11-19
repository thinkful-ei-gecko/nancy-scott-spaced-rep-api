const LinkedList = require('../linked-list/LinkedList');
const llHelp = require('../linked-list/linkedListHelpers');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getHead(db, user_id) {
    return db
      .from('language').where('language.user_id', '=', user_id)
      .join('word', function() {
        this.on('word.id', '=', 'language.head')
      })
  },

  getUsersWords(db, user_id) {
    return db
      .from('language').where('language.user_id', '=', user_id)
      .join('word', function() {
        this.on('language.id', '=', 'word.language_id')
      })
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  async generateLinkedList(db, user_id) {

    const dataset = await this.getUsersWords(db, user_id);
    const linkedList = new LinkedList();
    dataset.forEach(word => linkedList.insertLast({
      id: word.id,
      language_id: word.language_id,
      original: word.original,
      translation: word.translation,
      next: word.next,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    }))
    return linkedList;
  },

  updateLinkedList(wasCorrect, linkedList) {
    // if correct (double M) and move
    //if not correct (reset M) and move
    if (wasCorrect) {
      linkedList.head.memory_value *= 2; 
    } else {
      linkedList.head.memory_value = 1; 
    }
  },

  updateDatabase(linkedList, user_id) {
    // use knex to insert updated LinkedList into db
  }
}

module.exports = LanguageService
