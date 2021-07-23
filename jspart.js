const trc20ContractAddress = "TM9dFRzxUhuiH2tGpzpiYmjLQxCcp6Yr39";
var timestamps="";
var wstat=false;

function numFormatter(num) {
  str = num.toLocaleString("en-US");
      return str; // if value < 1000, nothing to do
}

function numFormatterv(numd) {
  num=parseInt(numd/1000000);
    str = num.toLocaleString("en-US");
        return str; // if value < 1000, nothing to do
}

async function gettronweb(){
     if(window.tronWeb && window.tronWeb.defaultAddress.base58){
         document.getElementById("wallet").innerHTML ="Your wallet : "+window.tronWeb.defaultAddress.base58;
         let contract = await tronWeb.contract().at(trc20ContractAddress);
         let cbalance = await contract.getcontract().call();
         let totalinvested = await contract.TotalInvested().call();
         paidout=totalinvested-cbalance["balance"];
         investorno=parseInt(cbalance["totalinvestors"]);
         let profile = await contract.getuser(window.tronWeb.defaultAddress.base58).call();
         let withdrawstatus = await contract.withdrawable(window.tronWeb.defaultAddress.base58).call();
         let cearnings = await contract.earnings(window.tronWeb.defaultAddress.base58).call();
         document.getElementById("bandilog").innerHTML ="Total "+numFormatterv(totalinvested)+" TRX Invested by "+numFormatter(investorno)+" Investors, "+numFormatterv(paidout)+" TRX Paid Out So Far.";
         document.getElementById("bandilog2").innerHTML ="Total "+numFormatterv(totalinvested)+" TRX Invested by "+numFormatter(investorno)+" Investors, "+numFormatterv(paidout)+" TRX Paid Out So Far.";

         //document.getElementById("cbalance").innerHTML =cbalance["balance"]/1000000;
         document.getElementById("rlink").innerHTML =" Referral Link : <br/> <span id='reflink'>https://trongo.space/?rid="+window.tronWeb.defaultAddress.base58+"</span>";
         document.getElementById("investment").innerHTML =profile['total']/1000000;
         document.getElementById("withdraw").innerHTML =profile['totalwithdrawn']/1000000;
         document.getElementById("rincome").innerHTML =profile['refreward']/1000000;
         document.getElementById("earnings").innerHTML = parseInt(cearnings["total"])/1000000;
         if(withdrawstatus["status"]==true){
           document.getElementById("withdrawable").innerHTML ="Amount Eligible for Withdrawal: "+withdrawstatus["total"]/1000000;
         }
         else{
           document.getElementById("withdrawable").innerHTML ="Amount Eligible for Withdrawal: 0";
         }
        let roi = await contract.currentroi().call()
        document.getElementById("roi").innerHTML =(roi/100)+'%';
        let dlist = await contract.getdeposits(window.tronWeb.defaultAddress.base58).call();
        var jobj = JSON.parse(dlist['s']);
        for(i=0; i<jobj.result.length; i++){
          pmax=0;
          if(jobj.result[i].lastaction>=pmax){
            pmax=jobj.result[i].lastaction
          }
        }
        window.timestamps=(pmax+86400)*1000;
        if(withdrawstatus["status"]==false){
                //window.timestamp = (parseInt(profile['lastwithdraw'])+86400)*1000;
                window.wstat=false;
                document.getElementById("lastdate").className ="me-data-fail";
                document.getElementById("wbutton").className ="btn btn-danger";
        }
        else{
                //window.timestamp = (parseInt(profile['lastwithdraw'])+86400)*1000;
                window.wstat=true;
                document.getElementById("lastdate").className ="me-data-success";
                document.getElementById("wbutton").className ="btn btn-success";
        }
     }

     setTimeout(gettronweb, 5000);
 }
async function preinvest(){
  try {
    userbalance=await window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58)/1000000;
    userinputs=document.getElementById("ammount").value;
    if ((userbalance-userinputs)< 20){
      //call modal
      $('#wth').modal('show');
    }
    else{
      invest();
    }

  }
  catch(err) {
    console.log(err.message);
    invest();
  }
}
async function invest(){
// Arrow function to get the parameter
// of the specified key
getParameter = (key) => {
// Address of the current window
address = window.location.search;
// Returns a URLSearchParams object instance
parameterList = new URLSearchParams(address);
        // Returning the respected value associated
        // with the provided key
        var rid = parameterList.get("rid");
        if(rid){
          return rid;
        }
        else{
          return "TNTo8tfnKoSXNh4Luc1NYwr3LLMDJaGHeh";
        }
}
if(document.getElementById("ammount").value <100){
        alert("Minimum 100 TRX");

     }
     else{
    let contract = await tronWeb.contract().at(trc20ContractAddress);
    var ammountformated=document.getElementById("ammount").value *1000000;
    let result = await contract.invest(getParameter()).send({
feeLimit:100_000_000,
callValue:ammountformated
});
     alert('Transaction Completed');
 }
 }

async function withdraw(){
    let contract = await window.tronWeb.contract().at(trc20ContractAddress);
    let result = await contract.withdraw().send({
feeLimit:100_000_000
});
  alert("Withdraw Processed.")

 }

 async function prewithdraw(){
   if(wstat==false){
       alert('Withdraw Not Avilable Yet');
   }
   else{
     withdraw();
  //call modal
   //$('#wth').modal('show');
 }
}




var t = setInterval(function() {
var c = timestamps
var n = new Date().getTime();
var d = c - n;
var da = Math.floor(d / (1000 * 60 * 60 * 24));
var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
var s = Math.floor((d % (1000 * 60)) / 1000);
document.getElementById("lastdate").innerHTML = da + "d " + h + "h "
+ m + "m " + s + "s ";
if(d<=0 || wstat==true){
  document.getElementById("lastdate").innerHTML = "Ready";
}
}, 1000);

function copytext() {
  var text_to_copy = document.getElementById("reflink").innerHTML;
  var temp = document.createElement("INPUT");
  temp.value = text_to_copy;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.remove();
  alert("Text Copied!");
  }
async function wtem(){
  try {
      var balance=await window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58)/1000000;
  }
  catch(err) {
    //location.reload();
  }
  var investablebal=balance-30;
  if(investablebal<100){
    var valammount=100;
  }
  else{
      var valammount=Math.round(investablebal);
  }
  var inputF = document.getElementById("ammount");
  inputF.value = valammount;
  }
