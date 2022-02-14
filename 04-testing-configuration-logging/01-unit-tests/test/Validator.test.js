const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      it('проверка типа поля, должна быть строка', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 10});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').to.be.equal('name');
        expect(errors[0]).to.have.property('error').to.be.equal('expect string, got number');
      });

      it('валидатор проверяет минимальную длину строки', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('валидатор проверяет максимальную длину строки', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 1,
            max: 5,
          },
        });

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 6');
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      it('проверка типа поля, должно быть число', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: ''});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').to.be.equal('age');
        expect(errors[0]).to.have.property('error').to.be.equal('expect number, got string');
      });

      it('валидатор проверяет минимальное значение', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: 10});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('too little, expect 18, got 10');
      });

      it('валидатор проверяет максимальное значение', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: 100});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').to.be.equal('age');
        expect(errors[0]).to.have.property('error').to.be.equal('too big, expect 27, got 100');
      });
    });

    describe('выполнения проверки на наличее обязательных полей', () => {
      it('проверка на наличее поля max', () => {
        const validator = new Validator({
          name: {
            type: 'number',
            min: 10,
          },
        });

        const errors = validator.validate({name: 100});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('error').to.be.equal('expect field max, got undefined');
      });

      it('проверка на наличее поля min', () => {
        const validator = new Validator({
          name: {
            type: 'number',
            max: 10,
          },
        });

        const errors = validator.validate({name: 100});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('error').to.be.equal('expect field min, got undefined');
      });

      it('проверка на наличее поля type', () => {
        const validator = new Validator({
          name: {
            min: 10,
            max: 100,
          },
        });

        const errors = validator.validate({name: 100});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('error').to.be.equal('expect field type, got undefined');
      });
    });
  });
});
