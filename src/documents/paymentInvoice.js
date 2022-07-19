export const htmlContent = ({ name, regn, receiptId, transId, passFeeHead, feeAmount, tax, totalFees, paidOn }) => {
  return (

    `  
    <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>RATM - Invoice</title>
            <!-- <link
              href="https://fonts.googleapis.com/css2?family=Dongle&family=Mochiy+Pop+P+One&family=Ubuntu:wght@300&display=swap"
              rel="stylesheet"
            /> -->
            <link href="https://fonts.googleapis.com/css2?family=Dongle&family=Mochiy+Pop+P+One&family=Ubuntu:wght@300&display=swap" rel="stylesheet">
            // <link rel="stylesheet" href="/src/bootstrap.min.css" />
            <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous"> -->
          </head>
          </head>
          <style>
            h4 {
              margin: 10px;
              font-size: 1px;
            }
            .main {
              height: calc(100%- 20px);
              min-width: 100%;
              margin-top: 0.1px;
              // border: 1px solid black;
              font-family: 'Ubuntu', sans-serif;
            }
            .container {
              display: grid;
              place-items: center;
            }
            .invoice--content--heading{
                font-size: 1px;
                font-weight: bold;
            }
            .invoice--footer img{
                height: 5px;
                width: 5px;
                object-fit: cover;
            }
          </style>
          <body>
            <div class="container">
              <div class="main">
                <!-- Header -->
                <div class="d-flex justify-content-center my-4">
                  <img src="http://127.0.0.1:5000/api/ratm_logo.jpg" alt="" />
                </div>

                <!-- Content -->
                <div class="m-2 p-3">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="invoice--content--heading my-2">Name: ${name}</h4>
                    </div>
                    <div class="col">
                      <h4 class="invoice--content--heading my-2">Due Date: ${paidOn}</h4>
                    </div>
                  </div>

                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="invoice--content--heading my-2">Regn: ${regn}</h4>
                    </div>
                    <div class="col">
                      <h4 class="invoice--content--heading my-2">Receipt Id: ${receiptId}</h4>
                    </div>
                  </div>
                </div>

                <!-- Table -->
                <div class="mx-3 my-2 p-2">
                    <table class="table table-striped">
                        <thead>
                            <th>SNo.</th>
                            <th>Transaction Id</th>
                            <th>Head</th>
                            <th>Amount (in Rs)</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>${transId}</td>
                                <td>${passFeeHead}</td>
                                <td>${feeAmount}.00</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex flex-column justify-content-center align-items-end">
                        <p>
                            Tax: &#8377; ${tax}
                        </p>
                        <p>
                            Total Amount : <strong>&#8377; ${totalFees}</strong>

                        </p>
                    </div>
                </div>
                <!-- Footer -->
                <div class="d-flex justify-content-center invoice--footer">
                    <img src="http://127.0.0.1:5000/api/invoice_verify.jpg" alt="" class="fluid">
                </div>
              </div>
            </div>
          </body>
        </html>
      `
  )
}

