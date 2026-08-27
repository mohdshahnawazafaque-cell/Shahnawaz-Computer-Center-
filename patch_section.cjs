const fs = require('fs');
const filePath = 'src/components/SarkariYojanaSection.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const anchorPoint = `                      <span>{item.guidelineText || "Guidelines"}</span>
                    </a>
                  ) : (`;

const newCode = `                      <span>{item.guidelineText || "Guidelines"}</span>
                    </a>
                  ) : (`;

// Wait, I need to add the note below the buttons.
const searchBlock = `                  )}
                </div>
              </div>
            </div>
          ))}
        </div>`;

const replacementBlock = `                  )}
                </div>
                {item.note && (
                  <p className="text-[10px] text-center text-slate-500 mt-2.5 font-medium bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>`;

content = content.replace(searchBlock, replacementBlock);
fs.writeFileSync(filePath, content);
console.log("Patched section");
