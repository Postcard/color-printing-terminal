
class Buffer {
  constructor(opts){
    this.code = "";
    this.onSubmitCode = opts.onSubmitCode;
  }

  push(letter){
    this.code += letter;
    if(code.length === this.CODE_LENGTH) {
      this.onSubmitCode(this.code);
      this.reset();
    }
  }

  reset(){
    this.code = '';
  }

  delete(){
    if(this.code.length > 0){
      this.code = this.code.slice(0, -1);
    }
  }
}

Buffer.CODE_LENGTH = 5;

module.exports = Buffer;
