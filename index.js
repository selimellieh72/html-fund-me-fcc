// in front-end javascript you can't use require
import { ethers } from "./ethers-5.1.esm.min.js"
import { ABI, CONTRACT_ADDRESS } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerText = "Connected!"
    } else {
        connectButton.innerText = "Please install metamask!"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(CONTRACT_ADDRESS)
        console.log(ethers.utils.formatEther(balance))
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blochcain
        // signer / wallet / someone with some gaz
        // contract that we are interact with
        // ^ ABI & address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            await listenForTranscractionMine(transactionResponse, provider)

            console.log("Done!")

            // listen for the tx to be mined
            // listen for an event <- we haven't learned about that yeab
        } catch (error) {
            console.log(error)
        }

        console.log(signer)
    }
}

function listenForTranscractionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)

    // create a listener for the blockchain
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
// fund function

// withdraw

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTranscractionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
