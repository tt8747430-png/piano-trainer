import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.*;
import ghidra.program.model.symbol.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.address.*;
import ghidra.app.cmd.function.CreateFunctionCmd;
import ghidra.app.cmd.disassemble.DisassembleCommand;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public class DecompMatching extends GhidraScript {
  public void run() throws Exception {
    String[] args = getScriptArgs();
    String patFile = args[0]; String outFile = args[1];
    List<Pattern> pats = new ArrayList<>(); List<Pattern> neg = new ArrayList<>();
    for (String l : java.nio.file.Files.readAllLines(new File(patFile).toPath())) { if (l.isBlank()) continue; if (l.startsWith("!")) neg.add(Pattern.compile(l.substring(1))); else pats.add(Pattern.compile(l)); }
    DecompInterface di = new DecompInterface();
    DecompileOptions opt = new DecompileOptions(); opt.setMaxPayloadMBytes(1024); opt.setDefaultTimeout(600);
    di.setOptions(opt); di.toggleCCode(true); di.openProgram(currentProgram);
    PrintWriter pw = new PrintWriter(new FileWriter(outFile));
    SymbolIterator it = currentProgram.getSymbolTable().getAllSymbols(true);
    List<Symbol> todo = new ArrayList<>();
    while (it.hasNext()) { Symbol s = it.next(); String n = s.getName(true);
      boolean bad=false; for (Pattern p: neg) if (p.matcher(n).find()) bad=true; if (bad) continue; for (Pattern p: pats) if (p.matcher(n).find()) { todo.add(s); break; } }
    println("matched " + todo.size());
    for (Symbol s : todo) {
      Address a = s.getAddress();
      if (!currentProgram.getMemory().getBlock(a).isExecute()) continue;
      Function f = getFunctionAt(a);
      if (f == null) {
        new DisassembleCommand(a, null, true).applyTo(currentProgram, monitor);
        CreateFunctionCmd c = new CreateFunctionCmd(a); c.applyTo(currentProgram, monitor); f = getFunctionAt(a);
      }
      if (f == null) { pw.println("// FAILED " + s.getName(true)); continue; }
      DecompileResults r = di.decompileFunction(f, 600, monitor);
      pw.println("// ===== " + s.getName(true) + " @ " + a);
      if (r.decompileCompleted()) pw.println(r.getDecompiledFunction().getC()); else pw.println("// decompile failed: " + r.getErrorMessage());
      pw.flush();
    }
    pw.close();
  }
}
