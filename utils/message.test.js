var expect  = require('expect');
var {generateMessage}  = ('./message');

describe('generateMessage',function(){
    it('should generate correct message',function(){
        var from = 'abc';
        var text  = 'some message';
        var message  = generateMessage(from,text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text});
        
    });

});