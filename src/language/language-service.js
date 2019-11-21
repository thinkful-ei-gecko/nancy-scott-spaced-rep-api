const LinkedList = require('../linked-list/LinkedList');
const listHelpers = require('../linked-list/linkedListHelpers');


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
    console.log('dataset is', dataset)
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
  // spaced rep algorithm
  updateLinkedList(wasCorrect, linkedList, db) {
    // if correct (double M) and move
    //if not correct (reset M) and move
    // console.log('linkedlist in update ll', JSON.stringify(linkedList, null, 2))
    if (wasCorrect) {
      linkedList.head.value.memory_value *= 2; 
      // this.updateMValue(db, linkedList.head.value.id, linkedList.head.value.memory_value)
      linkedList.head.value.correct_count++;

    } else {
      linkedList.head.value.memory_value = 1; 
      // this.updateMValue(db, linkedList.head.value.id, linkedList.head.value.memory_value)
      linkedList.head.value.incorrect_count++;
    }

    // console.log('ll head m value:',linkedList.head.value.memory_value)

    //TODO
    // move the head to the correct memory value slot
    // console.log(linkedList.head)
    linkedList.insertAt(linkedList.head.value, linkedList.head.value.memory_value)

    this.updateMovedWordDatabase(db, linkedList.head.value.id, linkedList.head.value.memory_value, linkedList.head.value.correct_count, linkedList.head.value.incorrect_count, linkedList.head.value.next)
    
    //.remove returns the id of the node it st removed
    let idRemoved = linkedList.remove(linkedList.head.value)

    //To DO: need to get the updatedNext value
    this.updateBeforeMovedWordDatabase(db, idRemoved, )
    // console.log(JSON.stringify(linkedList, null, 2))
    console.log('THIS SHOULD BE THE UPDATED LINKEDLIST',JSON.stringify(linkedList, null, 2))
    return linkedList
  },

  async updateMovedWordDatabase(db, wordId, mvalue, correctC, incorrectC, next){
    // console.log('in updateMvalue',wordId, mvalue, correctC, incorrectC, next)
    // return await db('word')
    //   .where('id', wordId)
    //   .update({
    //     memory_value: mvalue,
    //     correct_count: correctC,
    //     incorrect_count: incorrectC,
    //     next: next
    //   })
  },


  async updateBeforeMovedWordDatabase(db, wordId, updatedNext){
    console.log('in updateBforeMoved', db,  wordId, updatedNext)
  },

  async updateLanguageDatabase(db, linkedList, user_id) {
    // use knex to insert updated LinkedList into db
    console.log('in update lang db',linkedList.head.value.id, user_id)
    return await db('language')
      .where('user_id', user_id)
      .update({head: linkedList.head.value.id})
  },



}



module.exports = LanguageService
