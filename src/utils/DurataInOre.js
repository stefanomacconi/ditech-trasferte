// eslint-disable-next-line no-unused-vars
export default class DurataInOre {
    //var minuti;
	SEPARATORE_DECIMALI = ".";
	NUMERO_DECIMALI = 2;

  /*
  constructor(oreMinuti) {
    console.log("DurataInOre->constructor: ", oreMinuti);
  var oreAbs = Math.abs(Math.floor(oreMinuti));
  var minutiAbs = Math.abs(this.parteDecimale(oreMinuti));
  if (minutiAbs > 59) {
      console.log("Minuti devono essere inferiori a 60");
  }
  this.minuti = oreAbs * 60 + minutiAbs;
  if (oreMinuti < 0 ) {
    this.minuti *= -1;
  }        
  }
  */

  constructor(oreCent) {
    // console.log("DurataInOre->constructor: ", oreCent);
    var oreAbs = Math.abs(Math.floor(oreCent));
    var centesimiAbs = Math.abs(this.parteDecimale(oreCent));
    if (centesimiAbs > 99) {
      alert("Centesimi devono essere inferiori a 99")
    // console.log("Centesimi devono essere inferiori a 99");
    }
    this.minuti = oreAbs * 60 + Math.floor(centesimiAbs*60/100);
    if (oreCent < 0 ) {
        this.minuti *= -1;
    }        
  }


  toOreCentesimi() {
    return (this.parteOre() + this.parteMinuti() / 60.0).toFixed(this.NUMERO_DECIMALI);
  }
  toOreMinuti() {
    return (this.parteOre() + this.parteMinuti() / 100.0).toFixed(this.NUMERO_DECIMALI);
  }
  
    
  parteOre() {
    return Math.floor(this.minuti / 60);
  }

  parteMinuti() {
    return Math.floor(this.minuti % 60);
  }    

  parteDecimale(numero)  {
    var parteDecimale;
    var s = numero.toString();
    var dove = s.indexOf(this.SEPARATORE_DECIMALI);
    var decimali = 0;
    if (dove >= 0) {
      dove++;
      if (dove + this.NUMERO_DECIMALI > s.length) {
        parteDecimale = s.substring(dove);
      } else {
        parteDecimale = s.substring(dove, dove + this.NUMERO_DECIMALI);
      }
      decimali = parseInt(parteDecimale);
      if (decimali > 0) {
        var decimaliMancanti = this.NUMERO_DECIMALI - parteDecimale.length;
        if (decimaliMancanti > 0) {
          decimali = Math.floor(decimali * Math.pow(10,decimaliMancanti)); 
        }
      }
    }
    return decimali;
  }	
}