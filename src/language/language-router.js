const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();
const bodyParser = express.json();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const headWord = await LanguageService.getHead(
        req.app.get('db'),
        req.user.id
      )
      res.json({
        nextWord: headWord[0].original,
        totalScore: headWord[0].total_score,
        wordCorrectCount: headWord[0].correct_count,
        wordIncorrectCount: headWord[0].incorrect_count
      })
      res.send('blah')
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .use(bodyParser)
  .post('/guess', async (req, res, next) => {
    try {

      const { guess } = req.body;

      const list = await LanguageService.generateLinkedList(
        req.app.get('db'),
        req.user.id
      )
      const verdict = guess === list.head.value.translation;

      const updatedList = LanguageService.updateLinkedList(verdict, list);

      next()
    } catch (error) {
      next(error)
    }
    res.send('implement me!')
  })

module.exports = languageRouter
