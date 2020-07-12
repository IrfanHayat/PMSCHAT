var expect = require('expect');
var {isRealString} = require('./validation.js');


describe ('isRealString',function(){
    it('reject non string values',function(){
        var res  = isRealString(98);
        expect(res).toBe(false);
    });

    it('reject string with spaces',function(){
        var res  = isRealString(' ');
        expect(res).toBe(false);
    });

    it('allow string with non-spaces characters',function(){
        var res  = isRealString(' Jahanzaib ');
        expect(res).toBe(true);
    });
})