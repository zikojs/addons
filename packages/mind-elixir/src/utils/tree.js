import {
  plaintextToMindElixir,
  mindElixirToPlaintext
} from "mind-elixir/plaintextConverter";



const a = plaintextToMindElixir(
`
    Child 1
Child 1-1 [^id1]
Child 1-2 {"color": "#e87a90", "fontSize": "18px", "fontFamily": "Arial"}
}:2 Summary of first two nodes
Child 2 [^id2]
[^id1] <-label-> [^id2]
`)

console.log(a)