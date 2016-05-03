import {List, Map, fromJS} from 'immutable'
import {expect} from 'chai'
import {setEntries, next, vote} from '../src/core'


describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({

        entries: List.of('Trainspotting', '28 Days Later')
      }))
    }) //end add entries

    it('converts to immutable', () => {
      const state = Map()
      const entries = ['Trainspotting', '28 Days Later']
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    }) // end converts

  }) //end set entries

  describe('next', () => {

    it('takes the next two entries for a vote', () => {

      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }))
    })

    it('puts the winner of a current vote back into entries', () => {

      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2

          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }))
    })

    it('puts the tied pair of a current vote back into entries', () => {

      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 4

          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      }))
    })

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }))
    })

  }) //end describe next

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {

      const state = Map({
        vote: Map({pair: List.of('Trainspotting', '28 Days Later')}),
        entries: List()
      })

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({'Trainspotting': 1})
        }),
        entries: List()
      }))
    })

    it('increments a tally for an existing entry', () => {

      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
      }),
        entries: List()
      })

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2

          })
        }),
        entries: List()
      }))
    })

  }) //end describe vote



}) //end application logic
