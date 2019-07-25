import {shallowMount} from '@vue/test-utils';
import DateInput from '@/components/DateInput';

describe('components/DateInput', () => {
  const createTestSubject = (value) => {
    return shallowMount(DateInput, {
      propsData: {value},
    });
  };

  describe('properties', () => {
    describe('value', () => {
      const prop = DateInput.props.value;

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      describe('valid values', () => {
        const goodValues = [
          ['a Date object', new Date()],
          ['a null value', null],
          ['an undefined value', undefined],
        ];

        it.each(goodValues)('accepts %s', (label, value) => {
          expect(prop.validator(value)).toBe(true);
        });
      });

      describe('invalid values', () => {
        const badValues = [
          ['a String', '2019-01-01'],
          ['a Number', 1550583417768],
          ['boolean true', true],
          ['boolean false', true],
        ];

        it.each(badValues)('does not accept %s', (label, value) => {
          expect(prop.validator(value)).toBe(false);
        });
      });
    });

    describe('type', () => {
      const prop = DateInput.props.type;

      it('is not required', () => {
        expect(prop.required).not.toBe(true);
      });

      it('defaults to "date"', () => {
        expect(prop.default).toBe('date');
      });

      describe('valid values', () => {
        const goodValues = [
          ['date'],
          ['month'],
        ];

        it.each(goodValues)('accepts "%s"', (value) => {
          expect(prop.validator(value)).toBe(true);
        });
      });

      describe('invalid values', () => {
        const badValues = [
          ['ymd'],
          ['ym'],
          ['a bad string'],
          [true],
        ];

        it.each(badValues)('does not accept "%s"', (value) => {
          expect(prop.validator(value)).toBe(false);
        });
      });
    });
  });

  describe('computed properties', () => {
    let subject;
    beforeEach(() => {
      subject = createTestSubject(new Date());
    });

    describe('dayInput', () => {
      describe('getter', () => {
        describe('given `day` is null', () => {
          it('returns null', () => {
            subject.setData({ day: null });
            expect(subject.vm.dayInput).toBe(null);
          });
        });

        describe('given `day` is a number', () => {
          it('returns `day` as a string', () => {
            subject.setData({ day: 15 });
            const value = subject.vm.dayInput;

            expect(typeof value).toBe('string');
            expect(value).toBe('15');
            expect(parseInt(value)).toBe(15);
          });

          it('zero pads single digit values to 2 characters', () => {
            subject.setData({ day: 1 });
            const value = subject.vm.dayInput;

            expect(typeof value).toBe('string');
            expect(value).toBe('01');
            expect(value).toHaveLength(2);
          });
        });
      });

      describe('setter', () => {
        describe('given a non-numeric value', () => {
          it('sets `day` to null', () => {
            subject.vm.dayInput = 'a string';
            expect(subject.vm.day).toBe(null);
          });
        });

        describe('given a numeric string', () => {
          it('sets `day` to the integer value of the string', () => {
            subject.vm.dayInput = '7';
            expect(subject.vm.day).toBe(7);
          });
        });

        describe('upper bound of 31', () => {
          it('rewrites values over 31 as 31', () => {
            subject.vm.dayInput = '45';
            expect(subject.vm.day).toBe(31);
          });
        });

        describe('lower bound of 1', () => {
          it('rewrites zero values as 1', () => {
            subject.vm.dayInput = '0';
            expect(subject.vm.day).toBe(1);
          });
          it('rewrites negative values as 1', () => {
            subject.vm.dayInput = '-10';
            expect(subject.vm.day).toBe(1);
          });
        });
      });
    });

    describe('monthInput', () => {
      describe('getter', () => {
        describe('given `month` is null', () => {
          it('returns null', () => {
            subject.setData({ month: null });
            expect(subject.vm.monthInput).toBe(null);
          });
        });

        describe('given `month` is a number', () => {
          it('returns `month` as a string', () => {
            subject.setData({ month: 10 });
            const value = subject.vm.monthInput;

            expect(typeof value).toBe('string');
            expect(value).toBe('10');
            expect(parseInt(value)).toBe(10);
          });

          it('zero pads single digit values to 2 characters', () => {
            subject.setData({ month: 1 });
            const value = subject.vm.monthInput;

            expect(typeof value).toBe('string');
            expect(value).toBe('01');
            expect(value).toHaveLength(2);
          });
        });
      });

      describe('setter', () => {
        describe('given a non-numeric value', () => {
          it('sets `month` to null', () => {
            subject.vm.monthInput = 'a string';
            expect(subject.vm.month).toBe(null);
          });
        });

        describe('given a numeric string', () => {
          it('sets `month` to the integer value of the string', () => {
            subject.vm.monthInput = '7';
            expect(subject.vm.month).toBe(7);
          });
        });

        describe('upper bound of 12', () => {
          it('rewrites values over 12 as 12', () => {
            subject.vm.monthInput = '45';
            expect(subject.vm.month).toBe(12);
          });
        });

        describe('lower bound of 1', () => {
          it('rewrites zero values as 1', () => {
            subject.vm.monthInput = '0';
            expect(subject.vm.month).toBe(1);
          });
          it('rewrites negative values as 1', () => {
            subject.vm.monthInput = '-10';
            expect(subject.vm.month).toBe(1);
          });
        });
      });
    });

    describe('yearInput', () => {
      describe('getter', () => {
        describe('given `year` is null', () => {
          it('returns null', () => {
            subject.setData({ year: null });
            expect(subject.vm.yearInput).toBe(null);
          });
        });

        describe('given `year` is a number', () => {
          it('returns `year` as a number', () => {
            subject.setData({ year: 1986 });
            const value = subject.vm.yearInput;

            expect(typeof value).toBe('number');
            expect(value).toBe(1986);
          });
        });
      });

      describe('setter', () => {
        describe('given a non-numeric value', () => {
          it('sets `year` to null', () => {
            subject.vm.yearInput = 'a string';
            expect(subject.vm.year).toBe(null);
          });
        });

        describe('given a numeric string', () => {
          it('sets `year` to the integer value of the string', () => {
            subject.vm.yearInput = '1986';
            expect(subject.vm.year).toBe(1986);
          });
        });
      });
    });

    describe('dateConstructor', () => {
      describe('given property type="date"', () => {
        beforeEach(() => {
          subject.setProps({type: 'date'});
        });

        describe('and `day`, `month` and `year` fields are set', () => {
          it('returns an array of Date constructor arguments', () => {
            subject.setData({day: 12, month: 4, year: 1980});
            expect(subject.vm.dateConstructor).toHaveLength(3);
            expect(subject.vm.dateConstructor).toEqual([1980, 3, 12]);
          });

          it('adjusts month to be zero-indexed, as required by Date constructor', () => {
            subject.setData({day: 1, month: 1, year: 1960});
            expect(subject.vm.dateConstructor).toEqual([1960, 0, 1]);

            subject.setData({day: 25, month: 12, year: 1960});
            expect(subject.vm.dateConstructor).toEqual([1960, 11, 25]);
          });
        });
      });

      describe('given property type="month"', () => {
        beforeEach(() => {
          subject.setProps({type: 'month'});
        });

        describe('and `month` and `year` fields are set', () => {
          it('returns an array of Date constructor arguments', () => {
            subject.setData({day: 12, month: 4, year: 1980});
            expect(subject.vm.dateConstructor).toHaveLength(2);
            expect(subject.vm.dateConstructor).toEqual([1980, 3]);
          });

          it('adjusts month to be zero-indexed, as required by Date constructor', () => {
            subject.setData({day: 1, month: 1, year: 1960});
            expect(subject.vm.dateConstructor).toEqual([1960, 0]);

            subject.setData({day: 25, month: 12, year: 1960});
            expect(subject.vm.dateConstructor).toEqual([1960, 11]);
          });
        });
      });

      describe('given at least one field is null', () => {
        const nullValueCombinations = [
          ['`day` is null',                      {day: null, month: 4,    year: 1980}],
          ['`month` is null',                    {day: 12,   month: null, year: 1980}],
          ['`year` is null',                     {day: 12,   month: 4,    year: null}],
          ['`day` and `month` are null',         {day: null, month: null, year: 1980}],
          ['`day` and `year` are null',          {day: null, month: 4,    year: null}],
          ['`month` and `year` are null',        {day: 12,   month: null, year: null}],
          ['`day`, `month` and `year` are null', {day: null, month: null, year: null}],
        ];

        it.each(nullValueCombinations)('returns null (%s)', (label, data) => {
          subject.setData(data);
          expect(subject.vm.dateConstructor).toBe(null);
        });
      });
    });

    describe('date', () => {
      describe('getter', () => {
        describe('given the date is not set (`dateConstructor` returns null)', () => {
          it('returns null', () => {
            subject.setData({day: null, month: null, year: null});
            expect(subject.vm.date).toBe(null);
          });
        });

        describe('given a date is set (`dateConstructor` returns constructor args)', () => {
          it('returns a Date object', () => {
            expect(subject.vm.date).toBeInstanceOf(Date);
          });

          it('is created as a UTC Date (not in local timezone)', () => {
            // Choosing a date where London is in BST so we can test local time vs UTC
            subject.setData({day: 1, month: 6, year: 2018});

            const args = subject.vm.dateConstructor;
            const utcTime = Date.UTC(...args);
            const local = new Date(...args);

            expect(subject.vm.date.getTime()).toEqual(utcTime);
            expect(subject.vm.date.getTime()).not.toEqual(local.getTime());
          });
        });
      });

      describe('setter', () => {
        describe('given a non-Date value', () => {
          it('does nothing', () => {
            subject.setData({day: 17, month: 5, year: 2018});
            subject.vm.date = null;
            expect(subject.vm.day).toBe(17);
            expect(subject.vm.month).toBe(5);
            expect(subject.vm.year).toBe(2018);
          });
        });

        describe('given a Date object', () => {
          beforeEach(() => {
            subject.vm.date = new Date(Date.UTC(2018, 5, 17));
          });

          it('sets `day` to the Date object\'s UTC date', () => {
            expect(subject.vm.day).toBe(17);
          });
          it('sets `month` to the Date object\'s UTC month +1 (so it\'s not zero-indexed)', () => {
            expect(subject.vm.month).toBe(6);
          });
          it('sets `year` to the Date object\'s UTC full year', () => {
            expect(subject.vm.year).toBe(2018);
          });
        });
      });
    });
  });

  describe('`v-model` interface', () => {
    describe('when the `value` property changes', () => {
      let realDateSetter;
      let mockDateSetter;
      beforeEach(() => {
        // Mock the date setter
        realDateSetter = DateInput.computed.date.set;
        mockDateSetter = jest.fn();
        DateInput.computed.date.set = mockDateSetter;
      });

      afterEach(() => {
        DateInput.computed.date.set = realDateSetter;
      });

      describe('given the new `value` is different from the current `date`', () => {
        it('sets `date` to equal the new `value`', () => {
          const firstDate = new Date('1960-01-01');
          const secondDate = new Date('1975-04-19');

          const subject = createTestSubject(firstDate);
          subject.setProps({value: secondDate});

          expect(mockDateSetter).toHaveBeenCalledTimes(2);
          expect(mockDateSetter).toHaveBeenNthCalledWith(1, firstDate);
          expect(mockDateSetter).toHaveBeenNthCalledWith(2, secondDate);
        });
      });

      describe('given the new `value` is the same as the current `date`', () => {
        it('avoids an infinite feedback loop by doing nothing (does not set `date`)', () => {
          // Two equal dates as different objects
          const firstDate = new Date('1960-01-01');
          const secondDate = new Date('1960-01-01');

          const subject = createTestSubject(firstDate);
          subject.setProps({value: secondDate});

          expect(mockDateSetter).toHaveBeenCalledTimes(1);
          expect(mockDateSetter.mock.calls[0][0]).toBe(firstDate);
          expect(mockDateSetter.mock.calls[0][0]).not.toBe(secondDate);
        });
      });
    });

    describe('when the internal `date` Date object changes', () => {
      it('emits an `input` event', () => {
        const subject = createTestSubject(new Date());
        const newDate = new Date('1985-06-17');
        subject.vm.date = newDate;

        const emitted = subject.emitted().input;

        expect(emitted.length).toBeGreaterThan(0);
        expect(emitted).toContainEqual([newDate]);
      });
    });
  });

  describe('#created lifecycle hook', () => {
    it('sets `date` to equal the `value` property', () => {
      const value = new Date('1960-01-01');
      const subject = createTestSubject(value);
      expect(subject.vm.date).not.toBe(value);
      expect(subject.vm.date).toEqual(value);
    });
  });

  describe('input fields', () => {
    let subject;
    beforeEach(() => {
      subject = createTestSubject(new Date('2018-01-01'));
    });

    describe('given property type="date"', () => {
      describe('Day input', () => {
        let input;
        beforeEach(() => {
          input = subject.find({ ref: 'dayInput' });
        });

        describe('is lazily bound to `dayInput`', () => {
          it('displays the value of `dayInput`', () => {
            expect(input.element.value).toBe(subject.vm.dayInput);
          });
          it('updates `dayInput` on change', () => {
            input.element.value = '12';
            input.trigger('change');
            expect(subject.vm.dayInput).toBe('12');
          });
          it('does nothing on input/keypress', () => {
            input.element.value = '12';
            input.trigger('input');
            expect(subject.vm.dayInput).not.toBe('12');
            expect(subject.vm.dayInput).toBe('01');
          });
        });

        it('has an ID attribute bound to `dayInputId`', () => {
          expect(input.attributes('id')).toBe(subject.vm.dayInputId);
        });

        it('has an associated label element', () => {
          const id = input.attributes('id');
          const label = subject.find(`label[for="${id}"]`);
          expect(label.exists()).toBe(true);
        });
      });
    });

    describe('given property type="month"', () => {
      beforeEach(() => {
        subject.setProps({type: 'month'});
      });

      describe('Day input', () => {
        it('is not rendered', () => {
          const input = subject.find({ ref: 'dayInput' });
          expect(input.exists()).toBe(false);
        });
      });
    });

    describe('Month input', () => {
      let input;
      beforeEach(() => {
        input = subject.find({ ref: 'monthInput' });
      });

      describe('is lazily bound to `monthInput`', () => {
        it('displays the value of `monthInput`', () => {
          expect(input.element.value).toBe(subject.vm.monthInput);
        });
        it('updates `monthInput` on change', () => {
          input.element.value = '6';
          input.trigger('change');
          expect(subject.vm.monthInput).toBe('06');
        });
        it('does nothing on input/keypress', () => {
          input.element.value = '6';
          input.trigger('input');
          expect(subject.vm.monthInput).not.toBe('6');
          expect(subject.vm.monthInput).toBe('01');
        });
      });

      it('has an ID attribute bound to `monthInputId`', () => {
        expect(input.attributes('id')).toBe(subject.vm.monthInputId);
      });

      it('has an associated label element', () => {
        const id = input.attributes('id');
        const label = subject.find(`label[for="${id}"]`);
        expect(label.exists()).toBe(true);
      });
    });

    describe('Year input', () => {
      let input;
      beforeEach(() => {
        input = subject.find({ ref: 'yearInput' });
      });

      describe('is lazily bound to `yearInput`', () => {
        it('displays the value of `yearInput`', () => {
          expect(input.element.value).toBe(subject.vm.yearInput.toString());
        });
        it('updates `yearInput` on change', () => {
          input.element.value = '2010';
          input.trigger('change');
          expect(subject.vm.yearInput).toBe(2010);
        });
        it('does nothing on input/keypress', () => {
          input.element.value = '2008';
          input.trigger('input');
          expect(subject.vm.yearInput).not.toBe('2008');
          expect(subject.vm.yearInput).toBe(2018);
        });
      });

      it('has an ID attribute bound to `yearInputId`', () => {
        expect(input.attributes('id')).toBe(subject.vm.yearInputId);
      });

      it('has an associated label element', () => {
        const id = input.attributes('id');
        const label = subject.find(`label[for="${id}"]`);
        expect(label.exists()).toBe(true);
      });
    });
  });

  describe('multiple instances on the same page', () => {
    let subject1, subject2;
    beforeEach(() => {
      subject1 = createTestSubject(new Date());
      subject2 = createTestSubject(new Date());
    });

    describe('inputs have globally unique ID attributes', () => {
      it('Day input has a unique ID attribute', () => {
        const id1 = subject1.find({ref: 'dayInput'}).element.id;
        const id2 = subject2.find({ref: 'dayInput'}).element.id;
        expect(id1).not.toEqual(id2);
      });
      it('Month input has a unique ID attribute', () => {
        const id1 = subject1.find({ref: 'monthInput'}).element.id;
        const id2 = subject2.find({ref: 'monthInput'}).element.id;
        expect(id1).not.toEqual(id2);
      });
      it('Year input has a unique ID attribute', () => {
        const id1 = subject1.find({ref: 'yearInput'}).element.id;
        const id2 = subject2.find({ref: 'yearInput'}).element.id;
        expect(id1).not.toEqual(id2);
      });
    });
  });
});